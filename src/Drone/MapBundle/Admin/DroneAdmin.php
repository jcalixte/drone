<?php
namespace Drone\MapBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class DroneAdmin extends Admin
{
	// Fields to be shown on create/edit forms
	protected function configureFormFields(FormMapper $formMapper) {
		$formMapper
			->add('product', 'text', array('label' => 'Produit'))
			->add('user', 'entity', array('class' => 'Drone\UserBundle\Entity\User'))
			//->add('body') //if no type is specified, SonataAdminBundle tries to guess it
		;
	}

	// Fields to be shown on filter forms
	protected function configureDatagridFilters(DatagridMapper $datagridMapper) {
		$datagridMapper
			->add('product')
			->add('user')
		;
	}

	// Fields to be shown on lists
	protected function configureListFields(ListMapper $listMapper) {
		$listMapper
			->addIdentifier('product')
			->add('user')
		;
	}
}
