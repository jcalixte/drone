<?php

namespace Drone\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
	/**
	 * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
	 */
	public function dashboardAction()
    {
	    $user = $this->getUser();
	    if(!$user){
		    return $this->redirect($this->generateUrl("fos_user_security_login"));
	    }

	    $delete_forms = Array();

	    foreach ($user->getDrones() as $drone) {
			$delete_forms[$drone->getId()] = $this->createDeleteForm($drone->getId())->createView();
		}


	    return $this->render('DroneUserBundle:Dashboard:dashboard.html.twig', array(
	        "user"         => $user,
		    "delete_forms" => $delete_forms
        ));
    }

	/**
	 * Creates a form to delete a Drone entity by id.
	 *
	 * @param mixed $id The entity id
	 *
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createDeleteForm($id) {
		return $this->createFormBuilder()
			->setAction($this->generateUrl('drone_delete', array('id' => $id)))
			->setMethod('DELETE')
			->add('submit', 'submit', array(
				'label' => 'supprimer',
				'attr'  => array(
					'class' => 'btn btn-danger'
				)
			))
			->getForm()
			;
	}
}
