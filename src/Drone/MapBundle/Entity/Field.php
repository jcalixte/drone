<?php

namespace Drone\MapBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Drone\UserBundle\Entity\User as User;

/**
 * Field
 *
 * @ORM\Table()
 * @ORM\Entity
 * @Vich\Uploadable
 */
class Field
{
	/**
	 * @var integer
	 *
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;

	/**
	 * @ORM\ManyToOne(targetEntity="Drone\UserBundle\Entity\User", inversedBy="fields")
	 * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=true)
	 **/
	private $user;

	/**
	 * @ORM\Column(type="json_array", name="locations")
	 *
	 * @var json_array $locations
	 */
	protected $locations;

	/**
	 * @Vich\UploadableField(mapping="map_image", fileNameProperty="imageName", nullable=true)
	 *
	 * @var File $imageFile
	 */
	protected $imageFile;

	/**
	 * @ORM\Column(type="string", length=255, name="image_name", nullable=true)
	 *
	 * @var string $imageName
	 */
	protected $imageName;

	/**
	 * @ORM\Column(type="datetime", nullable=true)
	 *
	 * @var \DateTime $updatedAt
	 */
	protected $updatedAt;

	public function __construct(){

	}

	/**
	 * Get id
	 *
	 * @return integer 
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * Set name
	 *
	 * @param string $name
	 * @return Map
	 */
	public function setName($name)
	{
		$this->name = $name;

		return $this;
	}

	/**
	 * Get name
	 *
	 * @return string 
	 */
	public function getName()
	{
		return $this->name;
	}

	/**
	 * Set user
	 *
	 * @param \Drone\UserBundle\Entity\User $user
	 * @return Map
	 */
	public function setUser(\Drone\UserBundle\Entity\User $user = null)
	{
		$this->user = $user;

		return $this;
	}

	/**
	 * Get user
	 *
	 * @return \Drone\UserBundle\Entity\User 
	 */
	public function getUser()
	{
		return $this->user;
	}

	/**
	 *
	 * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile $image
	 */
	public function setImageFile(File $image = null)
	{
		$this->imageFile = $image;

		if ($image) {
			$this->setUpdatedAt(new \DateTime('now'));
		}
	}

	/**
	 * @return File
	 */
	public function getImageFile()
	{
		return $this->imageFile;
	}

	/**
	 * @param string $imageName
	 */
	public function setImageName($imageName)
	{
		$this->imageName = $imageName;
	}

	/**
	 * @return string
	 */
	public function getImageName()
	{
		return $this->imageName;
	}

	/**
	 * Set locations
	 *
	 * @param array $locations
	 * @return Field
	 */
	public function setLocations($locations)
	{
		$this->locations = $locations;

		return $this;
	}

	/**
	 * Get locations
	 *
	 * @return array 
	 */
	public function getLocations()
	{
		return $this->locations;
	}

	/**
	 * Set updatedAt
	 *
	 * @param \DateTime $updatedAt
	 * @return Field
	 */
	public function setUpdatedAt($updatedAt)
	{
		$this->updatedAt = $updatedAt;

		return $this;
	}

	/**
	 * Get updatedAt
	 *
	 * @return \DateTime 
	 */
	public function getUpdatedAt()
	{
		return $this->updatedAt;
	}
}
